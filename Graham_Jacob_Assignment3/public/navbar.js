// function and format derived from w3schools navbar tutorial https://www.w3schools.com/css/css_navbar.asp and w3schools dropdown tutorial https://www.w3schools.com/tags/tag_select.asp
function navbar() {
    document.write(`
    <div class="navbar">
    <a class="active" href="./index.html"><i class="fa fa-fw fa-home"></i> Home</a>
        <a href="./products_display.html?cards"> Cards</a>
        <a href="./products_display.html?coll_boxes"> Premium Collection Boxes</a>
        <a href="./products_display.html?etbs"> ETBs</a>
        <div class="topnav-right">
        <a style="align:right, text-align: right" href="./cart.html"><i class="fa fa-fw fa-shopping-cart"></i> Cart</a>
        <a style="align:right, text-align: right" href="./login.html"><i class="fa fa-fw fa-user"></i> Login</a>
        </div>
    </div>
    `);
}