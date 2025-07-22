export interface eItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  category?: string;
}

export interface eSummary {
  originalAmount?: number;
  discount?: number;
  totalAmount: number;
}

export interface ReceivedProduct {
  productName: string;
  quantity: number;
}

export class eService {
  private thresholdPromotion: { threshold: number; discount: number } | null = null;
  private bogoCosmeticsActive = false;

  setThresholdPromotion(promotion: { threshold: number; discount: number } | null) {
    this.thresholdPromotion = promotion;
  }

  setBogoCosmeticsActive(active: boolean) {
    this.bogoCosmeticsActive = active;
  }

  calculateOrder(items: eItem[]): { summary: eSummary; received: ReceivedProduct[] } {
    let totalAmount = 0;

    // 依商品分組計算折扣
    for (const item of items) {
      const groupCount = Math.floor(item.quantity / 10);
      const remain = item.quantity % 10;
      // 每 10 件 8 折
      totalAmount += groupCount * 10 * item.unitPrice * 0.8;
      // 剩餘原價
      totalAmount += remain * item.unitPrice;
    }

    return {
      summary: { totalAmount: Math.round(totalAmount) },
      received: items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
      })),
    };
  }
}