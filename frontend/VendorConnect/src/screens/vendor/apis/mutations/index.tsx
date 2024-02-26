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
      profession
    }
  }
`;
