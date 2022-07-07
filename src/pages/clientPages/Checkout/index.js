import { useState } from "react";
import { useStyles } from "./style";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from "@material-ui/core";
import {} from "@material-ui/icons";
import { Shipping } from "./Shipping";
import { useDispatch, useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import { UserAxios } from "../../../api/instances";
import * as Api from "../../../api/endpoints";
import { useHistory } from "react-router-dom";
import { emptyCart } from "../../../redux/slices/user";
import { withUserAuth } from "../../../hoc/withUserAuth";
import { Loader } from "../../../components/Loader/";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";


const getSteps = () => ["Shipping Address", "Payment Info"];

const Checkout = withUserAuth(true)((props) => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const contentLoading = useSelector((state) => state.orders.contentLoading);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [processing, setProcessing] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [refId, setRefId] = useState("");

  const config = {
    public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: user.cart.price,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user.email,
      phonenumber: "07064586146",
      name: user.name,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const changeCountryHandler = (e) => setCountry(e.target.value);
  const changeCityHandler = (e) => setCity(e.target.value);
  const changeAddress1Handler = (e) => setAddress1(e.target.value);
  const changeAddress2Handler = (e) => setAddress2(e.target.value);
  const changeZipCodeHandler = (e) => {
    if (isNaN(Number(e.target.value))) return;
    setZipCode(e.target.value.trim());
  };

  const isStepSkipped = (step) => skipped.has(step);

  const nextStepHandler = () => {
    const newSkipped = [...skipped.values(), activeStep];
    setSkipped(new Set([...newSkipped]));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Shipping
            country={country}
            city={city}
            address1={address1}
            address2={address2}
            zipCode={zipCode}
            changeCountryHandler={changeCountryHandler}
            changeCityHandler={changeCityHandler}
            changeAddress1Handler={changeAddress1Handler}
            changeAddress2Handler={changeAddress2Handler}
            changeZipCodeHandler={changeZipCodeHandler}
            nextStepHandler={nextStepHandler}
          />
        );
      case 1:
        return (
          <section>
            <Typography>
              This is just a demo website. You can use this to test your
              payment.
            </Typography>

            <form className={classes.cardForm} onSubmit={props.paymentHandler}>
              <Button
                className={classes.btn}
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => {
                  handleFlutterPayment({
                    callback: async (response) => {
                      if (response.status === "successful") {
                        setPaidAmount(response?.amount);
                        setRefId(response?.tx_ref);
                        try {
                          await UserAxios.post(Api.CREATE_ORDER, {
                            country,
                            city,
                            address1,
                            address2,
                            zipCode,
                          });

                          dispatch(emptyCart());

                          NotificationManager.success("Order placed");

                         
                          setProcessing(false);
                        } catch (error) {
                          NotificationManager.error(error.message);
                        }
                      }
                   
                      closePaymentModal(); // this will close the modal programmatically
                      history.replace("/");
                    },
                    onClose: () => {
                      console.log("closing flutterwave payment");
                    },
                  });
                }}
              >
                Pay ${user?.cart?.price} Flutterwave
              </Button>
            </form>
          </section>
        );
      default:
        return <p>No Content</p>;
    }
  };

  return (
    <Container maxWidth="lg">
      {contentLoading ? (
        <Loader />
      ) : (
        <>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label, index) => {
              let stepProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = true;
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {getStepContent(activeStep)}
        </>
      )}
    </Container>
  );
});

const Component = () => <Checkout />;

export { Component as Checkout };
