// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { User } from '@daml.js/create-daml-app';
import { publicContext, userContext } from './App';
import UserList from './UserList';
import PartyListEdit from './PartyListEdit';
import MessageEdit from './MessageEdit';
import MessageList from './MessageList';
import BetSlipList from './BetSlipList';
import BetSlipEdit from './BetSlipEdit';

// USERS_BEGIN

// Keep the Follow Code up and running

// In parallel add similar calls from the BetSlip DAML 


const MainView: React.FC = () => {
  const username = userContext.useParty();
  const house=userContext.useParty();
  const myUserResult = userContext.useStreamFetchByKeys(User.User, () => [username], [username]);

  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const myUser = myUserResult.contracts[0]?.payload;
  
  //const myBetSlips = myBetSlipResult.contracts[0]?.payload;

  const allUsers = userContext.useStreamQueries(User.User).contracts;
// USERS_END

  // Sorted list of users that are following the current user
  const followers = useMemo(() =>
    allUsers
    .map(user => user.payload)
    .filter(user => user.username !== username)
    .sort((x, y) => x.username.localeCompare(y.username)),
    [allUsers, username]);

  // Map to translate party identifiers to aliases.
  const partyToAlias = useMemo(() =>
    new Map<Party, string>(aliases.contracts.map(({payload}) => [payload.username, payload.alias])),
    [aliases]
  );
  const myUserName = aliases.loading ? 'loading ...' : partyToAlias.get(username) ?? username;

  // FOLLOW_BEGIN - TODO  -  REMOVE FOLLOW FROM MAIN SCREEN
  
  const ledger = userContext.useLedger();

  const follow = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.Follow, username, {userToFollow});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }
  // FOLLOW_END

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUserName ? `Welcome, ${myUserName}!` : 'Loading...'}
            </Header>

            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {myUserName ?? 'Loading...'}
                  <Header.Subheader>Horses I am betting on...</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={myUser?.following ?? []}
                partyToAlias={partyToAlias}
                onAddParty={follow}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  The Race
                  <Header.Subheader>What horses have won recently...</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              {/* USERLIST_BEGIN */}
              <UserList
                users={followers}
                partyToAlias={partyToAlias}
                onFollow={follow}
              />
              {/* USERLIST_END */}
            </Segment>
            {/* HERE WHERE WE CREATE A BET SLIP / LIST ALL BET SLIPS FROM BACK END FOLLOWING THE SAME PATTERN  */}
            <Segment>
              <Header as='h2'>
                <Icon name='pencil square' />
                <Header.Content>
                  Messages
                  <Header.Subheader>Send a message to a follower</Header.Subheader>
                </Header.Content>
              </Header>
              <MessageEdit
                followers={followers.map(follower => follower.username)}
                partyToAlias={partyToAlias}
              />
              <Divider />
              <MessageList partyToAlias={partyToAlias}/>
              <Divider />
              <BetSlipList partyToAlias={partyToAlias}/>
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  Bets
                  <Header.Subheader>Place a bet</Header.Subheader>
                </Header.Content>
              </Header>
              <BetSlipEdit
                followers={followers.map(follower => follower.username)}
                partyToAlias={partyToAlias}
              />
              <Divider />
              <BetSlipList partyToAlias={partyToAlias}/>
              <Divider />
              <BetSlipList partyToAlias={partyToAlias}/>
            </Segment>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
