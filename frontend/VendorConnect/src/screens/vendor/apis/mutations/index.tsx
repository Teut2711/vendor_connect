import {gql} from '@apollo/client';

export const CREATE_VENDOR_MUTATION = gql`
  mutation CreateVendor(
    $typeValue: VendorTypeCategory
    $mobility: VendorMobilityCategory
    $profession: VendorProfessionCategory
  ) {
    vendor(
      partialVendor: {
        typeValue: $typeValue
        mobility: $mobility
        profession: $profession
      }
    ) {
      vendor {
        mobility
      }
    }
  }
`;
export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: PriceInput!
    $photo: String!
    $quantity: QuantityInput!
  ) {
    product(
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
