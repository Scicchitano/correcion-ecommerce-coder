const { userService, productService } = require("../repositories")
const { faker } = require('@faker-js/faker')

class MockController {
    constructor() {
        this.userService = userService;
        this.productService = productService;
    }

    newUser() {
        return {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: 50,
            password: faker.internet.password()
        };
    }

    generateUsers = async (req, res) => {
        console.log("creating users...");
        for (let i = 0; i < 100; i++) {
            const user = this.newUser();
            console.log(user);
            await this.userService.createUser(user);
        }
        res.status(200).send("100 users created");
    }

    newProduct() {
        return {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            code: faker.commerce.isbn(),
            price: faker.commerce.price(),
            status: faker.datatype.boolean(),
            stock: faker.number.int(), // Usar faker.number.int() en lugar de faker.datatype.number()
            category: faker.commerce.department(),
            owner: faker.internet.email(), // Corregido de faker.database.email() a faker.internet.email()
            thumbnails: [faker.image.imageUrl()]
        };
    }

    generateProducts = async (req, res) => {
        console.log("creating products...");
        for (let i = 0; i < 100; i++) {
            const product = this.newProduct();
            console.log(product);
            await this.productService.createProduct(product);
        }
        res.status(200).send("100 products created");
    }
}

module.exports = MockController;
