import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

function ContributeForm({ address }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formInput, updateFormInput] = useState({
    value: "",
  });
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(formInput.value, "ether"),
      });

      router.reload();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={formInput.value}
          onChange={(event) =>
            updateFormInput({
              ...formInput,
              value: event.target.value,
            })
          }
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
}

export default ContributeForm;
