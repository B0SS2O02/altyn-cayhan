const Product = require("./src/api/product/product");
const ProdCategory = require("./src/api/product/prodCategory");

const my = async () => {
  console.log("yeah");
  const prod = await Product.findAll();
  console.log(prod.length);
  for (let index = 0; index < prod.length; index++) {
    const element = prod[index];
    element.position = index + 1;
    await element.save();
  }
  console.log("yeah");

  const cat = await ProdCategory.findAll();
  for (let index = 0; index < cat.length; index++) {
    const element = cat[index];
    element.position = index + 1;
    await element.save();
  }
};
my();
