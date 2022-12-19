import React from 'react'
import { Form, Button } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { User } from '@daml.js/create-daml-app';
import { userContext } from './App';

type Props = {
  followers: Party[];
  partyToAlias: Map<string, string>;
}

/**
 * React component to edit a message to send to a follower.
 */
const BetSlipEdit: React.FC<Props> = ({followers, partyToAlias}) => {
  const bettor = userContext.useParty();
  const [house, setHouse] = React.useState<string | undefined>();
  const [horse, setHorse] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const ledger = userContext.useLedger();

  const submitMessage = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      if (house === undefined) {
        return;
      }
      setIsSubmitting(true);

      /***********  This where we exercise a top level choice from the UI    *****************/

      await ledger.exerciseByKey(User.User.CreateBetSlip, house, {house,bettor,horse});
      setContent("");
    } catch (error) {
      alert(`Error creating bet slip:\n${JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submitMessage}>
      <Form.Select
        fluid
        search
        className='test-select-message-receiver'
        placeholder={house ? partyToAlias.get(house) ?? house : "Select the house"}
        value={house}
        options={followers.map(follower => ({ key: follower, text: partyToAlias.get(follower) ?? follower, value: follower }))}
        onChange={(event, data) => setHouse(data.value?.toString())}
      />
      <Form.Input
        className='test-select-message-content'
        placeholder="Write a message"
        value={content}
        onChange={event => setContent(event.currentTarget.value)}
      />
      <Button
        fluid
        className='test-select-message-send-button'
        type="submit"
        disabled={isSubmitting || house === undefined || content === ""}
        loading={isSubmitting}
        content="Create Bet Slip"
      />
    </Form>
  );
};

export default BetSlipEdit;