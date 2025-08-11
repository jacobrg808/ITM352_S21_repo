// Navigation bar component
function navbar() {
    document.write(`
    <div class="navbar">
    <a class="active" href="./index.html"><i class="fa fa-fw fa-home"></i> Home</a>
        <a href="./cards.html"><i class="fa fa-fw fa-th-list"></i> Cards</a>
        <a href="./coll_boxes.html"><i class="fa fa-fw fa-th-list"></i> Premium Collection Boxes</a>
        <a href="./etbs.html"><i class="fa fa-fw fa-th-list"></i> ETBs</a>
        <div class="topnav-right">
        <a href="./shopping_cart.html"><i class="fa fa-fw fa-shopping-cart"></i> Cart</a>
        <a href="./login.html"><i class="fa fa-fw fa-user"></i> Login</a>
        </div>
    </div>
    `);
}