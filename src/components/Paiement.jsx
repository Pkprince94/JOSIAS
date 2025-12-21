<form action="https://marchand.maishapay.online/payment/vers1.0/merchant/checkout" method="POST">
  <input type="hidden" name="gatewayMode" value=0>  // required, 0 : SandBox 1 : Live
  <input type="hidden" name="publicApiKey" value="MP-LIVEPK-FUaorbsYg9LQyPuVWq3/2yelYopZz$3bu2weHuBryyqyPsfN04TvgMr/fNbG7422734Go0pl3cEer$aiQjtDvRs$T4$8u60uwoHX.11OBtc5.jFIF$sdeQ$M">// required
  <input type="hidden" name="secretApiKey" value="MP-LIVESK-bVjCT74T18Ef0QK3$l$TXS1RM4.fuX0JoB9FZehy$aZwGLe3qI.$1NSh61z1.5P/WM$a$sqiKLn1Y.yTm3CxXaXnoX1g7rEHQWAg8d2afFu2ZboIRTbs4FTy">// required
  <input type="hidden" name="montant" value="{TOTAL_AMOUNT}">// required
  <input type="hidden" name="devise" value="{USD}">// required
  <input type="hidden" name="callbackUrl" value="{callback Url}">// nullable
  <input type="submit" value="Payer">
</form>
              