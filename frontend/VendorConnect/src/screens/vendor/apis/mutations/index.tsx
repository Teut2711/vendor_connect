import {gql} from '@apollo/client';

export const CREATE_VENDOR_MUTATION = gql`
  mutation CreateVendor(
    $typeValue: VendorTypeCategory
    $mobility: VendorMobilityCategory
    $profession: VendorProfessionCategory
  ) {
    createVendor(
      partialVendor: {
        typeValue: $typeValue
        mobility: $mobility
        profession: $profession
      }
    ) {
      mobility
    }
  }
`;
export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: PriceInput!
    $photo: Upload
    $quantity: QuantityInput!
  ) {
    createProduct(
      partialProduct: {
        name: $name
        description: $description
        price: $price
        photo: $photo
        quantity: $quantity
      }
    ) {
      name
    }
  }
`;
