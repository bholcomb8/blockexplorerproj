import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { formatHexToHumanReadable } from './utils';
import Table from './Table';
import './AddressDetailsPage.css';

const fetchAddressDetails = async (alchemy, address) => {
  const recentTransactions = await alchemy.core.getAssetTransfers({
    fromAddress: address,
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
    maxCount: 10,
  });

  const ownedTokens = await alchemy.core.getTokenBalances(address);

  const tokenMetadata = await Promise.all(
    ownedTokens.tokenBalances.map(async (token) => {
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      return {
        ...token,
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        coinMarketCapName: metadata.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
    })
  );

  return { transactions: recentTransactions.transfers, tokens: tokenMetadata };
};

const AddressDetailsPage = ({ alchemy }) => {
  const { address } = useParams();

  const { data, error, isLoading } = useQuery(
    ['addressDetails', address],
    () => fetchAddressDetails(alchemy, address),
    { staleTime: 60000 } // Cache data for 1 minute
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading address details</div>;
  }

  const { transactions, tokens } = data;

  const txnColumn = [
    {
      Header: "Transaction Hash",
      accessor: "hash",
      Cell: ({ value }) => <Link to={`/transaction/${value}`}>{value}</Link>,
    },
    {
      Header: "From",
      accessor: "from",
      Cell: ({ value }) => <Link to={`/address/${value}`}>{value}</Link>,
    },
    {
      Header: "To",
      accessor: "to",
      Cell: ({ value }) => <Link to={`/address/${value}`}>{value}</Link>,
    },
    {
      Header: "Value",
      accessor: "value",
      Cell: ({ value }) => formatHexToHumanReadable(value),
    },
  ];

  const tokenColumn = [
    {
      Header: "Token",
      accessor: "name",
      Cell: ({ value, row }) => <a href={`https://coinmarketcap.com/currencies/${row.original.coinMarketCapName}`} target="_blank" rel="noopener noreferrer">{value}</a>,
    },
    {
      Header: "Symbol",
      accessor: "symbol",
    },
    {
      Header: "Balance",
      accessor: "tokenBalance",
      Cell: ({ value, row }) => formatHexToHumanReadable(value, row.original.decimals),
    },
  ];

  return (
    <div>
      <h2>Address Details for {address}</h2>
      <h3>Recent Transactions</h3>
      <Table columns={txnColumn} data={transactions} />
      <h3>Owned Tokens</h3>
      <Table columns={tokenColumn} data={tokens} />
    </div>
  );
};

export default AddressDetailsPage;
