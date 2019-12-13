// you can export a constructor function
// module.exports = function Product(){
// }

// You can create a class too

const products = [];

module.exports = class Product {
    constructor(title){
        this.title = title;
    }

    save(){
        products.push(this)
    }

    static fetchAll(){
        return products;
    }
}