import {gql} from '@apollo/client';

export const GET_VENDOR_QUERY = gql`
  query GetVendor {
    getVendorDetails {
      user {
        firstName
        lastName
        photo {
          name
        }
      }
      typeValue
      mobility
      profession
    }
  }
`;
