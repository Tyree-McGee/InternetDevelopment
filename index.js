// Tyre McGee

const express = require('express');

const app  = express();
app.use(express.json());

let customerId = 0;
let itemId = 0;
let cartId = 0;

function customerIdGenerator(){
    customerId += 1;
    return customerId;
}
function itemIdGenerator(){
    itemId += 1;
    return itemId;
}

function cartIdGenerator(){
    cartId += 1;
    return cartId;
}


let item = class{
    constructor(name, price, description) {
        this.id = itemIdGenerator();
        this.name = name;
        this.price = price;
        this.description = description;
        // Serialize to put on network
        // let send = JSON.stringify(items[0]);
    }
};

let cart =  class {
    constructor(customerId) {
        this.cartId = cartIdGenerator();
        this.customerId = customerId;
        this.itemList = [];
    }
}


let customer = class{
    constructor(firstName, lastName, email) {
        this.id = customerIdGenerator();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createCart();
    }

    createCart = () => {
        carts.push(new cart(this.id));
    }
}

let items = []
let customers = []
let carts = [];

customers.push(new customer( "Sally","Wallace","SW@gmail.com"));
customers.push(new customer("Sam","Smith","SM@gmail.com"));
customers.push(new customer("John","Williams","JW@gmail.com"));

items.push(new item("Phone", 300, "An Iphone"));
items.push(new item("TV", 100, "A Samsung TV"));
items.push(new item("Computer", 500, "A Dell Laptop"));
items.push(new item("Video Game", 70, "Marvel Avengers"));




carts.find(cart => cart.customerId === 1).itemList.push(items.find(item => item.id === 1));
carts.find(cart => cart.customerId === 1).itemList.push(items.find(item => item.id === 2));
carts.find(cart => cart.customerId === 1).itemList.push(items.find(item => item.id === 4));
carts.find(cart => cart.customerId === 2).itemList.push(items.find(item => item.id === 3));
//console.log(carts.find(cart => cart.customerId === 1));
//console.log(JSON.stringify(carts))



app.get('/user/:id', (req, res) => {
   const foundCustomer = customers.find((customer) => {return customer.id == req.params.id});
   if(foundCustomer)
   {res.send(JSON.stringify({id :foundCustomer}));}
   else{res.send(404);}
});

app.post('/user',(req,res) =>{
    let newFirstName = req.body.firstName;
    let newLastName = req.body.lastName;
    let newEmail = req.body.email;
    const newCustomer = new customer(newFirstName, newLastName, newEmail);
    customers.push(newCustomer);
    res.send(JSON.stringify(newCustomer));
});

app.get('/user/:id/cart', (req, res) => {
    const foundCustomer = customers.find((customer) => {return customer.id == req.params.id});
    const foundCart = carts.find(cart => cart.customerId === foundCustomer.id);
    if(foundCustomer && foundCart)
    {res.send(JSON.stringify({cart :foundCart.itemList}));}
    else
    {res.send(404);}
});

app.delete('/user/:id/cart', (req,res) =>{
    const foundCustomer = customers.find((customer) => {return customer.id == req.params.id});
    const foundCart = carts.find(cart => cart.customerId === foundCustomer.id);
    foundCart.itemList.splice(0, foundCart.itemList.length);
    if(foundCart)
    {res.send(JSON.stringify({cart :foundCart.itemList}));}
    else
    {res.send(404);}
});

app.post('/cart/:cartId/cartItem', (req,res) =>{
    const foundCart = carts.find((c) => {return c.cartId == req.params.cartId});
    const quantity = req.body.quantity;
    const itemId = req.body.itemId;

    for(let i = 0; i < quantity; i++){
        let itemToAdd = items.find(item => item.id === itemId)
        foundCart.itemList.push(itemToAdd);
    }
    res.send(JSON.stringify({cart: foundCart.itemList}));
});

app.delete('/cart/:cartId/cartItem/:cartItemId', (req,res) =>{
    const foundCart = carts.find((c) => {return c.cartId == req.params.cartId});
    const itemToDelete = foundCart.itemList.findIndex(item => item.id == req.params.cartItemId);

    if(itemToDelete >= 0 ) {
        foundCart.itemList.splice(itemToDelete, 1)
        res.send(JSON.stringify({cart: foundCart.itemList}));
    }
    else
        res.send(404);

});

app.get('/StoreItem/:StoreItemID', (req, res) =>{
    const foundItem = items.find(item => item.id == req.params.StoreItemID);

    if (foundItem != null) {
        res.send(JSON.stringify(foundItem));
    }
    else{
        res.send(404);
    }
});

app.get('/StoreItem', (req, res) =>{
    const searchedItem = req.param("query");
    const foundItem = items.find(item => item.name === searchedItem);
    if (foundItem != null) {
        res.send(JSON.stringify(foundItem));
    }
    else{
        res.send(404);
    }

})

app.listen(8080);

