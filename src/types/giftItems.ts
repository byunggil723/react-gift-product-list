export interface GiftItemDataType {
  id: number;
  name: string;
  imageURL: string;
  price: {
    basicPrice: number;
    discountRate: number;
    sellingPrice: number;
  };
  brandInfo: {
    id: number;
    name: string;
    imageURL: string;
  };
}

export interface GiftItemCardType {
  rank: number;
  id: number;
  name: string;
  image: string;
  brandName: string;
  price: number;
}
