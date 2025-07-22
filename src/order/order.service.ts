export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  category?: string;
}

export interface OrderSummary {
  originalAmount?: number;
  discount?: number;
  totalAmount: number;
}

export interface ReceivedProduct {
  productName: string;
  quantity: number;
}

export class OrderService {
  private thresholdPromotion: { threshold: number; discount: number } | null = null;
  private bogoCosmeticsActive = false;

  setThresholdPromotion(promotion: { threshold: number; discount: number } | null) {
    this.thresholdPromotion = promotion;
  }

  setBogoCosmeticsActive(active: boolean) {
    this.bogoCosmeticsActive = active;
  }

  calculateOrder(items: OrderItem[]): { summary: OrderSummary; received: ReceivedProduct[] } {
    // 處理 BOGO cosmetics
    let received = items.map(item => {
      if (this.bogoCosmeticsActive && item.category === 'cosmetics') {
        return {
          productName: item.productName,
          quantity: item.quantity + 1,
          unitPrice: item.unitPrice,
          category: item.category,
        };
      }
      return { ...item };
    });

    // 金額只計算原本購買的數量
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    // 處理 threshold promotion
    const originalAmount = totalAmount;
    let discount = 0;
    if (
      this.thresholdPromotion &&
      originalAmount >= this.thresholdPromotion.threshold
    ) {
      discount = this.thresholdPromotion.discount;
    }

    const finalTotal = totalAmount - discount;

    return {
      summary: this.thresholdPromotion
        ? { originalAmount, discount, totalAmount: finalTotal }
        : { totalAmount: finalTotal },
      received: received.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
      })),
    };
  }
}