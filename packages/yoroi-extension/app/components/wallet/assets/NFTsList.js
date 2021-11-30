// @flow
import type { ComponentType, Node } from 'react';
import { Box, styled } from '@mui/system';
import {
  IconButton,
  ImageList,
  Input,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { assetsMessage } from './AssetsList';
import Search from '../../../assets/images/assets-page/search.inline.svg';
import { defineMessages, injectIntl } from 'react-intl';
import type { $npm$ReactIntl$IntlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes-config';
import { useState } from 'react';
import { ListEmpty } from './ListEmpty';
import { NftCardImage } from './NftCardImage';
import { PublicDeriver } from '../../../api/ada/lib/storage/models/PublicDeriver';
import type { GetNftImageInfoResponse } from '../../../api/ada/lib/state-fetch/types';

type Props = {|
  list: Array<{| name: string, id: string, image: string | void |}> | void,
  tokenInfoStore: {|
    getNftImageInfo: {|
      fingerprint: string,
      networkId: number
    |} => Promise<GetNftImageInfoResponse>
  |},
  wallets: {| selected: null | PublicDeriver<> |}
|};
type Intl = {|
  intl: $npm$ReactIntl$IntlShape,
|};

const messages = defineMessages({
  noResultsFound: {
    id: 'wallet.assets.nft.noResultsFound',
    defaultMessage: '!!!No NFTs found',
  },
});

const listColumnViews = [
  { count: 2, gap: 32 },
  { count: 4, gap: 32 },
  { count: 6, gap: 16 },
];

const getDefaultColumnsView = () => listColumnViews[1];
function NfTsList({ list, intl, tokenInfoStore, wallets }: Props & Intl): Node {
  if (list == null) return null;
  const [columns, setColumns] = useState(getDefaultColumnsView());
  const [nftList, setNftList] = useState(list);

  const search: (e: SyntheticEvent<HTMLInputElement>) => void = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    const keyword = event.currentTarget.value;
    const regExp = new RegExp(keyword, 'gi');
    const nftsListCopy = [...list];
    const filteredAssetsList = nftsListCopy.filter(a => a.name.match(regExp));
    setNftList(filteredAssetsList);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="30px">
        <Typography variant="h5" color="var(--yoroi-palette-gray-900)">
          NFTs ({list.length})
        </Typography>
        <Box display="flex" alignItems="center">
          <Stack direction="row" spacing={1} marginRight="30px">
            {listColumnViews.map(column => (
              <IconButton
                key={column.count}
                onClick={() => setColumns(column)}
                sx={{
                  width: '40px',
                  backgroundColor:
                    column.count === columns.count ? 'var(--yoroi-palette-gray-300)' : 'none',
                }}
              >
                =
              </IconButton>
            ))}
          </Stack>
          <SearchInput
            disableUnderline
            onChange={search}
            placeholder={intl.formatMessage(assetsMessage.search)}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </Box>
      </Box>
      {!nftList.length ? (
        <ListEmpty message={intl.formatMessage(messages.noResultsFound)} />
      ) : (
        <ImageList sx={{ width: '100%' }} cols={columns.count} rowHeight="100%" gap={columns.gap}>
          {nftList.map(nft => {
            return (
              <SLink key={nft.name} to={ROUTES.ASSETS.NFT_DETAILS.replace(':nftId', nft.name)}>
                <NftCardImage
                  type='list'
                  ipfsUrl={nft.image}
                  name={nft.name}
                  fingerprint={nft.id}
                  tokenInfoStore={tokenInfoStore}
                  wallets={wallets}
                />
              </SLink>
            );
          })}
        </ImageList>
      )}
    </Box>
  );
}

export default (injectIntl(NfTsList): ComponentType<Props>);

const SearchInput = styled(Input)({
  border: '1px solid var(--yoroi-palette-gray-300)',
  borderRadius: '8px',
  width: '370px',
  height: '40px',
  padding: '10px 12px',
});
const SLink = styled(Link)({
  textDecoration: 'none',
});
