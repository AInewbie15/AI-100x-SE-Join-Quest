import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { eService, eItem } from '../../src/order/11.service';

let service: eService;
let items: eItem[] = [];
let result: any;

Given('雙十一優惠活動已啟動', function () {
  service = new eService();
});

Given('訂單中有 12 件價格為 100 元的襪子', function () {
  items = [
    {
      productName: '襪子',
      quantity: 12,
      unitPrice: 100,
    },
  ];
});

When('計算訂單總價', function () {
  result = service.calculateOrder(items);
});

Then('訂單總價應為 1000', function () {
  assert.strictEqual(result.summary.totalAmount, 1000);
});

Given('訂單中有 27 件價格為 100 元的襪子', function () {
  items = [
    {
      productName: '襪子',
      quantity: 27,
      unitPrice: 100,
    },
  ];
});

Then('訂單總價應為 2300', function () {
  assert.strictEqual(result.summary.totalAmount, 2300);
});

Given('訂單中有商品 A, B, C, D, E, F, G, H, I, J 各 1 件，且每件價格皆為 100 元', function () {
  items = [
    { productName: 'A', quantity: 1, unitPrice: 100 },
    { productName: 'B', quantity: 1, unitPrice: 100 },
    { productName: 'C', quantity: 1, unitPrice: 100 },
    { productName: 'D', quantity: 1, unitPrice: 100 },
    { productName: 'E', quantity: 1, unitPrice: 100 },
    { productName: 'F', quantity: 1, unitPrice: 100 },
    { productName: 'G', quantity: 1, unitPrice: 100 },
    { productName: 'H', quantity: 1, unitPrice: 100 },
    { productName: 'I', quantity: 1, unitPrice: 100 },
    { productName: 'J', quantity: 1, unitPrice: 100 },
  ];
});