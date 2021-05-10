// function and format derived from w3school navbar https://www.w3schools.com/css/css_navbar.asp
function navbar() {
    document.write(`
    <div class="navbar">
    <a class="active" href="./index.html"><i class="fa fa-fw fa-home"></i> Home</a>
        <a href="#"><i class="fa fa-fw fa-search"></i> Products</a>
        <a href="#"><i class="fa fa-fw fa-shopping-cart"></i> Cart</a>
        <a href="./login.html"><i class="fa fa-fw fa-user"></i> Login</a>
    </div>
    `);
}