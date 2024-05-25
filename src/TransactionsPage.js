import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { formatHexToHumanReadable } from './utils';
import Table from './Table';

const fetchTransactions = async (alchemy, blockNumber) => {
  const block = await alchemy.core.getBlockWithTransactions(parseInt(blockNumber));
  return block.transactions.map(txn => ({
    ...txn,
    value: txn.value.toString(),
  }));
};

const TransactionsPage = ({ alchemy }) => {
  const { blockNumber } = useParams();

  const { data: transactions, error, isLoading } = useQuery(
    ['blockTransactions', blockNumber],
    () => fetchTransactions(alchemy, blockNumber),
    { staleTime: 60000 }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading transactions</div>;
  }

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

  return (
    <div>
      <h2>Transactions for Block {blockNumber}</h2>
      <Table columns={txnColumn} data={transactions} />
    </div>
  );
};

export default TransactionsPage;
