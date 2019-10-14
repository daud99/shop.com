export interface CartInterface {
  total: number;
  _id: number;
  owner: number;
  items: [{
    item: {
      _id: number;
      category_id: string;
      name: string;
      price: number;
      image: string;
    };
    price: number;
    quantity: number;
    _id: string;
  }];
}