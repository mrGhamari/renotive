export type IProduct = {
  id: number;
  sku: string;
  meta: IMeta;
  title: string;
  price: number;
  stock: number;
  brand: string;
  weight: number;
  tags: string[];
  rating: number;
  category: string;
  images: string[];
  thumbnail: string;
  reviews: IReview[];
  description: string;
  returnPolicy: string;
  dimensions: IDimensions;
  discountPercentage: number;
  availabilityStatus: string;
  warrantyInformation: string;
  shippingInformation: string;
  minimumOrderQuantity: number;
};

type IDimensions = {
  width: number;
  depth: number;
  height: number;
};

type IReview = {
  date: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
};

type IMeta = {
  qrCode: string;
  barcode: string;
  createdAt: string;
  updatedAt: string;
};
