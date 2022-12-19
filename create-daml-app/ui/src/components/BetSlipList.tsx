import React from 'react'
import { List, ListItem } from 'semantic-ui-react';
import { User } from '@daml.js/create-daml-app';
import { userContext } from './App';
import { BetSlip } from '@daml.js/create-daml-app/lib/User';

type Props = {
  partyToAlias: Map<string, string>
}
/**
 * React component displaying the list of messages for the current user.
 * *********LIST OF BET SLIPS filled by the current user*******************
 */
const BetSlipList: React.FC<Props> = ({partyToAlias}) => {
  //Gets the stream of all message contracts visible to the current user  
  const betSlipResult = userContext.useStreamQueries(User.BetSlip);

  return (
    <List relaxed>
      {betSlipResult.contracts.map(betSlip=> {
        const {house,bettor,horse} = betSlip.payload;
        return (
          <ListItem
            className='test-select-message-item'
            key={betSlip.contractId}>
            <strong>{partyToAlias.get(house) ?? house} &rarr; {partyToAlias.get(bettor) ?? bettor}:</strong> {horse}
          </ListItem>
        );
      })}
    </List>
  );
};

export default BetSlipList;
