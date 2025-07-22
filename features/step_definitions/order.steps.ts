import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { OrderService, OrderItem } from '../../src/order/order.service';

let orderInput: any[] = [];
let orderSummary: any = {};
let receivedProducts: any[] = [];
let orderService = new OrderService();
let thresholdPromotion: { threshold: number, discount: number } | null = null;
let bogoCosmeticsActive = false;

Given('the buy one get one promotion for cosmetics is active', function () {
  bogoCosmeticsActive = true;
});

Given('the threshold discount promotion is configured:', function (dataTable) {
  const row = dataTable.hashes()[0];
  thresholdPromotion = {
    threshold: Number(row.threshold),
    discount: Number(row.discount),
  };
  orderService.setThresholdPromotion(thresholdPromotion);
});

Given('no promotions are applied', function () {
  thresholdPromotion = null;
  orderService.setThresholdPromotion(null);
});

When('a customer places an order with:', function (dataTable) {
  orderInput = dataTable.hashes().map(row => ({
    productName: row.productName,
    category: row.category,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unitPrice),
  }));
  orderService.setBogoCosmeticsActive(bogoCosmeticsActive);
  const result = orderService.calculateOrder(orderInput as OrderItem[]);
  orderSummary = result.summary;
  receivedProducts = result.received;
});

Then('the order summary should be:', function (dataTable) {
  const expected = dataTable.hashes()[0];
  Object.keys(expected).forEach(key => {
    assert.strictEqual(
      String(orderSummary[key]),
      String(expected[key]),
      `orderSummary.${key} should be ${expected[key]}`
    );
  });
});

Then('the customer should receive:', function (dataTable) {
  const expected = dataTable.hashes();
  assert.strictEqual(receivedProducts.length, expected.length, 'received products count mismatch');
  for (let i = 0; i < expected.length; i++) {
    assert.strictEqual(receivedProducts[i].productName, expected[i].productName);
    assert.strictEqual(
      String(receivedProducts[i].quantity),
      String(expected[i].quantity)
    );
  }
});