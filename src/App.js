import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Header from './Header';
import Table from './Table';
import TransactionsPage from './TransactionsPage';
import TransactionDetailsPage from './TransactionDetailsPage';
import AddressDetailsPage from './AddressDetailsPage';
import './App.css';
import { formatHexToHumanReadable } from './utils';

const fetchLatestBlocks = async (alchemy) => {
  const blockNumber = await alchemy.core.getBlockNumber();
  let blockArray = [];
  for (let i = 0; i < 30; i++) {
    const block = await alchemy.core.getBlock(blockNumber - i);
    blockArray.push(block);
  }
  return blockArray;
};

const fetchLatestTransactions = async (alchemy) => {
  const blockNumber = await alchemy.core.getBlockNumber();
  const block = await alchemy.core.getBlockWithTransactions(blockNumber);
  return block.transactions.slice(0, 30);
};

const App = ({ alchemy }) => {
  const { data: latestBlocks, error: blockError, isLoading: blockLoading } = useQuery(
    'latestBlocks',
    () => fetchLatestBlocks(alchemy),
    { staleTime: 60000 }
  );

  const { data: latestTransactions, error: transactionError, isLoading: transactionLoading } = useQuery(
    'latestTransactions',
    () => fetchLatestTransactions(alchemy),
    { staleTime: 60000 }
  );

  const blColumn = useMemo(
    () => [
      {
        Header: "Latest Blocks",
        accessor: "number",
        Cell: ({ value }) => <Link to={`/block/${value}`}>{value}</Link>,
      },
    ],
    []
  );

  const txnColumn = useMemo(
    () => [
      {
        Header: "Latest Transactions",
        accessor: "hash",
        Cell: ({ value }) => <Link to={`/transaction/${value}`}>{value}</Link>,
      },
    ],
    []
  );

  if (blockLoading || transactionLoading) {
    return <div>Loading...</div>;
  }

  if (blockError || transactionError) {
    return <div>Error loading data</div>;
  }

  return (
    <Router>
      <Header />
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => (
            <div className="table-container">
              <Table columns={blColumn} data={latestBlocks || []} />
              <Table columns={txnColumn} data={latestTransactions || []} />
            </div>
          )} />
          <Route path="/block/:blockNumber" render={() => <TransactionsPage alchemy={alchemy} />} />
          <Route path="/transaction/:transactionHash" render={() => <TransactionDetailsPage alchemy={alchemy} />} />
          <Route path="/address/:address" render={() => <AddressDetailsPage alchemy={alchemy} />} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

