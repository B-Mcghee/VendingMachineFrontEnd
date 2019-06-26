
$(document).ready(function(){

    loadItems();
    });
/************
AJAX increment money
***********/
$("#add-dollar").click(function(){
  moneyInsert(1.00);

});
$("#add-quarter").click(function(){
  moneyInsert(0.25);

});
$("#add-dime").click(function(){
  moneyInsert(0.10);

});
$("#add-nickel").click(function(){
  moneyInsert(0.05);

});

function moneyInsert(moneyInserted){
  var value = parseFloat($("#money-inserted").val());
  if (Number.isNaN(value)) {
    value = 0;
  }
  var money = moneyInserted;
  var newValue = money + parseFloat(value);
  $("#money-inserted").val(newValue.toFixed(2));
}

/************
AJAX request get all items
***********/
function loadItems(){
$.ajax({
  type: 'GET',
  url: ' https://tsg-vending.herokuapp.com/items',
  success: function(items, status, xhr){
    $("#item-loop").html("");
    // var allHtml = "";
    // $("#item-loop");
    var index = 0;
    for (var i = 0; i < items.length; i++) {
        index++;
        console.log(items[i]);
        var itemHTML = createHTML(items[i]);
        // allHtml+= questionHTML;

        $("#item-loop").append(itemHTML);
    }

},
  error: function(){
    $("#message-input").val(xhr.responseJSON.message).css('color','red').css('font-weight','bold');
  }});
}
  /************
  AJAX request make purchase
  ***********/
$("#purchase-button").click(function(){
  var itemNumber = parseInt($("#item-number").val());
  loadItems();
  var inserted = $("#money-inserted").val();
  if (Number.isNaN(itemNumber)) {
    return $("#message-input").val("That is not a valid request");
  }

        $.ajax({
          type: 'POST',
          url: 'https://tsg-vending.herokuapp.com/money/' + inserted + '/item/'+itemNumber,
          success: function(coins,status, xhr){
            var quarters =coins.quarters +" quarter(s) ";
            var dimes = coins.dimes + " dime(s) ";
            var nickels = coins.nickels + " nickel(s) ";
            var pennies = coins.pennies + " pennies ";
            var emptyString ="";
            if (coins.quarters != 0) {
                emptyString+=quarters;
              }
              if (coins.dimes != 0) {
                  emptyString+= dimes;
              }
              if (coins.nickels != 0) {
                  emptyString += nickels;
              }
              if (coins.pennies != 0) {
                  emptyString += pennies;
              }
              loadItems();
              $("#message-input").val("Thank You!!").css('color','black');
              $("#change-return").val(emptyString);
              $("#money-inserted").val((0.00).toFixed(2));
              $("#item-number").val("");

            },
          error: function(xhr, status, errorThrown){


            $("#message-input").val(xhr.responseJSON.message).css('color','red').css('font-weight','bold');

          }
        });

});

/************
functions
***********/
function createHTML(item, index){
  // <div class="item-slots col-sm-3">
  //   <p>1</p>
    // <h3 class="text-lg-center">snickers</h3>
    // <h3 class="text-lg-center">$1.85</h3>
    // <h5 class="text-lg-center">Quantity Left: 9</h5>
  // </div>

  var outerDiv = $("<div>");
  outerDiv.attr({
    "class":"item-slots col-lg-3 col-sm-5 col-md-5",
    "id": "vending-slots"
  });
  var pTag = $("<p>");
  pTag.html(item.id)
  outerDiv.append(pTag);
  var htag = $("<h5>");
  htag.attr({"class":"text-lg-center"});
  htag.html(item.name);
  outerDiv.append(htag);
  htag = $("<h5>");
  htag.attr({"class":"text-lg-center"});
  htag.html("$" +item.price.toFixed(2));
  // + item.name );
  // var h'<h3 class="text-lg-center">' + item.name + '</h3>';
  outerDiv.append(htag);
  htag = $("<h6>");
  htag.attr({"class":"text-lg-center"});
  htag.html("Quantity Left: " + item.quantity);
  outerDiv.append(htag);
  outerDiv.click(function(){
    // var placeholder = 'placeholder = ' + item.name;
    $("#message-input").val(item.name).css('color','black').css('font-weight','normal');
    $("#item-number").val(item.id);
  });

  return outerDiv;

}
