//SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.15;

import './libraries/Math.sol';
import './hyroERC20.sol';
import './libraries/UQ112x112.sol';
import './interfaces/IERC20.sol';
import './interfaces/IHyroFactory.sol';
import './interfaces/IHyroCallee.sol';
import './interfaces/IRouterV2.sol';

contract Hyro is HyroERC20 {
    using SafeMath  for uint;
    using UQ112x112 for uint224;
    address private constant ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
    uint public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));
    bytes4 private constant FROMSELECTOR = bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
    uint256 private constant MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    address private UNISWAP_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
 
    address public factory;
    address public hyro;
    address[] private tokens;
    mapping(address => uint256) private reserves;

    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;

    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'Hyro: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    

    function updateTokens() private {
        tokens = IHyroFactory(factory).whitelistedTokens();
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'Hyo: TRANSFER_FAILED');
    }

    function _safeTransferFrom(address token, address from, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(FROMSELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'Hyo: TRANSFER_FAILED');
    }

    event Mint(address indexed sender, uint liquidity, uint amountDeposit);
    event Burn(address indexed sender, uint amountWithdraw);
    event Swap(
        uint amountIn,
        uint amountOut,
        address tokenIn,
        address tokenOut
        
    );
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _hyro) external {
        require(msg.sender == factory, 'Hyro: FORBIDDEN'); // sufficient check
        hyro = _hyro;
        updateTokens();
    }

    function whitelisted(address _token) public view returns (bool) {
        for (uint256 i; i < tokens.length; i++) {
            if (tokens[i] == _token)
                return true;
        }
        return false;
    }

    function getReserves(address token) public view returns (uint256 _reserve, uint32 _blockTimestampLast) {
        _reserve = reserves[token];
        _blockTimestampLast = blockTimestampLast;
    }

    function getTokens() public view returns (address[] memory _tokens) {
        _tokens = tokens;
    }
    // update reserves and, on the first call per block, price accumulators
    function _update(uint _balance0, uint _balance1, address _token0, address _token1) private {
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
      /*  if (timeElapsed > 0 && reserves[_token0] != 0 && reserves[_token1] != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint(UQ112x112.encode(reserves[_token1]).uqdiv(reserves[_token0])) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(reserves[_token0]).uqdiv(reserves[_token1])) * timeElapsed;
        }*/
        reserves[_token0] = uint112(_balance0);
        reserves[_token1] = uint112(_balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserves[_token0], reserves[_token1]);
    }

    function mint(address to, uint256 _amount, address[][] memory paths) external lock returns (uint liquidity) {
        uint[] memory balances = new uint[](tokens.length);
        uint256 totAmounts = 0;
        _safeTransferFrom(tokens[0], msg.sender, address(this), _amount);
        for (uint i; i < tokens.length; i++) {
            balances[i] = IERC20(tokens[i]).balanceOf(address(this));
            totAmounts += IRouterV2(UNISWAP_ROUTER).getAmountsOut(balances[i], paths[i])[1];// ChainLink with 1Inch api;
        }
        uint256 amount = totAmounts.sub(_amount);

    //    bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {

            liquidity = amount - MINIMUM_LIQUIDITY;
           _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            uint percent = amount.mul(100) / totAmounts;
            liquidity = percent.mul(_totalSupply) / (100);
        }
        require(liquidity > 0, 'Hyro: INSUFFICIENT_LIQUIDITY_MINTED');
        _mint(to, liquidity);
        _update(IERC20(tokens[0]).balanceOf(address(this)), 0, tokens[0], ZERO_ADDRESS);
        emit Mint(msg.sender, liquidity, _amount);
    }

    function burn(address to, uint256 _amount, address[][] memory paths) external lock returns (uint amount0, uint amount1) {
        
        uint[] memory balances = new uint[](tokens.length);
        uint256 totAmounts;
        for (uint i; i < tokens.length; i++) {
            balances[i] = IERC20(tokens[i]).balanceOf(address(this));
            totAmounts += IRouterV2(UNISWAP_ROUTER).getAmountsOut(balances[i], paths[i])[1];
        }

        _safeTransferFrom(address(this), address(this), msg.sender, _amount);
        uint liquidity = balanceOf[address(this)];

        //bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        uint percent = liquidity.mul(100) / _totalSupply;
        uint256 amount = percent.mul(totAmounts) / (100); // using balances ensures pro-rata distribution
        require(amount > 0, 'Hyro: INSUFFICIENT_LIQUIDITY_BURNED');
        _burn(address(this), liquidity);
        for (uint256 i; i < tokens.length; i++) {
            if (reserves[tokens[i]] > 0) {
                uint256 ownedAmount = percent.mul(balances[i]) / (100);
                IRouterV2(UNISWAP_ROUTER).swapExactTokensForTokens(ownedAmount, 0, paths[i], address(this), block.timestamp + 1000);
                reserves[tokens[i]] = IERC20(tokens[i]).balanceOf(address(this));
            }
        }
        _safeTransfer(tokens[0], to, amount);
        _update(IERC20(tokens[0]).balanceOf(address(this)), 0, tokens[0], ZERO_ADDRESS);
        emit Burn(msg.sender, amount);
    }

    function swap(uint amountIn, uint minAmountOut, address tokenIn, address tokenOut, address[] memory path, uint256 slippage) external lock returns (uint256) {
        updateTokens();
        approveToken(tokenIn, UNISWAP_ROUTER);
        require (whitelisted(tokenIn) == true && whitelisted(tokenIn) == true, "Hyro: Only use Withlisted Token");
        IRouterV2(UNISWAP_ROUTER).swapExactTokensForTokens(amountIn, minAmountOut, path, address(this), block.timestamp + 1000);
        _update(IERC20(tokenIn).balanceOf(address(this)), IERC20(tokenOut).balanceOf(address(this)), tokenIn, tokenOut);
    }

    function approveToken(address _token, address _dex) private returns (bool) {
        require(whitelisted(_token), "Hyro: Token need to be on the whitelist");
        IERC20(_token).approve(_dex, MAX_UINT);
    }

    function skim(address to) external lock {
        updateTokens();
        for(uint256 i; i < tokens.length; i++) {
            _safeTransfer(tokens[i], to, IERC20(tokens[i]).balanceOf(address(this)).sub(reserves[tokens[i]]));
        }
        
    }

    // force reserves to match balances
    function sync() external lock {
        updateTokens();
        for(uint256 i; i < tokens.length; i++) {
            _update(IERC20(tokens[i]).balanceOf(address(this)), 0, tokens[i], ZERO_ADDRESS);
        }
    }
}
