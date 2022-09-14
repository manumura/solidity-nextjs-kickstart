import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { address } = context.query;
  return {
    props: {
      address,
    },
  };
}

function RequestNew({ address }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formInput, updateFormInput] = useState({
    value: "",
    description: "",
    recipient: "",
  });
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();

    const { description, value, recipient } = formInput;
    const campaign = Campaign(address);
    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <Link href={`/campaigns/${encodeURIComponent(address)}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={formInput.description}
            onChange={(event) =>
              updateFormInput({ ...formInput, description: event.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={formInput.value}
            onChange={(event) =>
              updateFormInput({ ...formInput, value: event.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={formInput.recipient}
            onChange={(event) =>
              updateFormInput({ ...formInput, recipient: event.target.value })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </div>
  );
}

export default RequestNew;
