import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { formatHexToHumanReadable } from './utils';
import './TransactionDetailsPage.css';

const fetchTransaction = async (alchemy, transactionHash) => {
  const txn = await alchemy.core.getTransaction(transactionHash);
  return txn;
};

const TransactionDetailsPage = ({ alchemy }) => {
  const { transactionHash } = useParams();

  const { data: transaction, error, isLoading } = useQuery(
    ['transactionDetails', transactionHash],
    () => fetchTransaction(alchemy, transactionHash),
    { staleTime: 60000 }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading transaction details</div>;
  }

  const formatTransactionData = (txn) => {
    return Object.entries(txn)
      .filter(([key]) => key !== 'accessList' && key !== 'wait')
      .map(([key, value]) => {
        let formattedValue = value;

        if (value === null || value === undefined) {
          formattedValue = 'N/A';
        } else if (typeof value === 'object') {
          formattedValue = JSON.stringify(value)
            .replace(/"type":\s*"[^"]*"/g, '')
            .replace(/"hex":\s*"([^"]*)"/g, '$1')
            .replace(/[{}[\],"]/g, '');
        } else {
          formattedValue = value.toString();
        }

        if (key === 'value' || key === 'gas' || key === 'gasPrice') {
          formattedValue = formatHexToHumanReadable(value);
        }

        return {
          key,
          value: formattedValue,
        };
      });
  };

  const transactionData = formatTransactionData(transaction);

  return (
    <div>
      <h2>Transaction Details for {transactionHash}</h2>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {transactionData.map((item, index) => (
            <tr key={index}>
              <td>{item.key}</td>
              <td className="wrap-text">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDetailsPage;
