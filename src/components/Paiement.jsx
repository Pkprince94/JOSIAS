
<form action="https://marchand.maishapay.online/payment/vers1.0/merchant/checkout" method="POST">
  <input type="hidden" name="gatewayMode" value=0>  // required, 0 : SandBox 1 : Live
  <input type="hidden" name="publicApiKey" value="">// required
  <input type="hidden" name="secretApiKey" value="">// required
  <input type="hidden" name="montant" value="{TOTAL_AMOUNT}">// required
  <input type="hidden" name="devise" value="{USD}">// required
  <input type="hidden" name="callbackUrl" value="{callback Url}">// nullable
  <input type="submit" value="Payer">
</form>
              