import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

function CampaignNew() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formInput, updateFormInput] = useState({
    minimumContribution: "",
  });
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(formInput.minimumContribution).send({
        from: accounts[0],
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Create Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={formInput.minimumContribution}
            onChange={(event) =>
              updateFormInput({
                ...formInput,
                minimumContribution: event.target.value,
              })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </div>
  );
}

export default CampaignNew;
