const next = document.querySelector(".next");
const previous = document.querySelector(".previous");
const steps = document.querySelectorAll(".step");
const checkbox = document.querySelector("#period");
const emptyField = "This field is required";
let counter = 1;


function UserSub(fName, email, phoneNumber, plan, period, addOns, total)
{
    this.fName = fName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.plan = plan;
    this.period = period;
    this.addOns = addOns;
    this.total = total;
}
function addUserSub(fName, email, phoneNumber, plan, period, addOns, total)
{
    return new UserSub(fName, email, phoneNumber, plan, period, addOns, total);
}

window.addEventListener("load", function ()
{
    const form = document.querySelector(".form");
    const formWidth = form.offsetWidth; 
    form.reset();
    console.log();
    checkbox.addEventListener("change", checkBoxEvt);

    function stepIndicator()
    {
        const stepList = document.querySelectorAll(".steps_list > li");
        if (counter > stepList.length)
        {
            counter = 4;
        }
        removeActiveTab(stepList)
        const step = document.querySelector(`.steps_list > li:nth-of-type(${counter})`);
        step.classList.add("active");
    }
    function removeActiveTab(element)
    {
        element.forEach(step =>
        {
            step.classList.remove("active");
        });

    }


    next.addEventListener("click", function ()
    {
        if (!validateForm()) return;
        removeActiveTab(steps);
        counter++;

        const nextStep = document.querySelector(`#step${counter}`);
        nextStep.style.transform = `translateX(${formWidth}px)`;

        nextStep.classList.add("active");
        stepIndicator();
        updateTable();

        if (counter === steps.length - 1)
        {
            next.innerText = "Confirm";
            next.setAttribute("type", "submit");
        }
    });

    previous.addEventListener("click", function ()
    {
        removeActiveTab(steps);
        counter--;
        stepIndicator();
        
        const prevStep = document.querySelector(`#step${counter}`);
        prevStep.classList.add("active");
        prevStep.style.transform = `translateX(-${formWidth}px)`;

        if (counter < steps.length - 1)
        {
            next.innerText = "Next Step";
        }
    });
});

const validateForm = (function ()
{
    const fname = document.querySelector("#fname").value;
    const email = document.querySelector("#email").value;
    const phoneNumber = document.querySelector("#phone_number").value;

    const inputFields = document.querySelectorAll("#step1 > input");
    const errFields = document.querySelectorAll("label:has(> .error_state)");
    let valid = true;



    if (errFields.length > 0)
    {
        errFields.forEach(field =>
        {
            const errorState = document.querySelector(".error_state")
            field.removeChild(errorState);
        });
    }

    inputFields.forEach(input =>
    {
        if (input.value === "")
        {
            const invalidFieldId = input.getAttribute("id");
            errorState(invalidFieldId, emptyField);
            valid = false;
            return
        };
    });

    if (fname.length < 8 && fname !== "")
    {
        valid = errorState("fname", "Minimum 8 characters required")
    }
    if (validateEmail(email) == null && email !== "")
    {
        valid = errorState("email", "Invalid email")
    };
    if (phoneNumber.length < 10 && phoneNumber !== "")
    {
        valid = errorState("phone_number", "Invalid PhoneNumber");
    }
    const userSubscription = new UserSub(fname, email, phoneNumber);
    return valid;
});



const checkBoxEvt = (function ()
{
    let period = "Monthly";

    const plans = document.querySelectorAll(".plan");
    if (this.checked)
    {
        let html = `<span class=free_trial>2 months free</span>`;
        period = "yearly";

        populatePlan(period);
        populateAddOns(period);
        plans.forEach(plan =>
        {
            plan.insertAdjacentHTML("beforeend", html);
        });
        return;
    }
    period = "monthly";
    populatePlan(period);
    populateAddOns(period);
    plans.forEach(plan =>
    {
        const freeTrial = document.querySelector(".free_trial");
        plan.removeChild(freeTrial);
    });
});

function populatePlan(period){
    const arcadePricing = document.querySelector(".price_arcade");
    const advancePricing = document.querySelector(".price_advance");
    const proPricing = document.querySelector(".price_pro");


    let arcadeAmt = 9;
    let advanceAmt = 12;
    let proAmt = 15;
  

    if (period === "yearly"){

        arcadePricing.innerText = `$${arcadeAmt * 10}/yr`;
        advancePricing.innerText = `$${advanceAmt * 10}/yr`;
        proPricing.innerText = `$${proAmt * 10}/yr`;
        return;
    }
    arcadePricing.innerText = `$${arcadeAmt}/mo`;
    advancePricing.innerText = `$${advanceAmt}/mo`;
    proPricing.innerText = `$${proAmt}/mo`;
}

function populateAddOns (period){
    const largeStoragePrice = document.querySelector("#large_storage + label .price_add_ons");
    const customProfilePrice = document.querySelector("#customizable_profile + label .price_add_ons");
    const onlineServicePrice = document.querySelector("#online_service + label .price_add_ons");

    let largeStorageAmt = 2;
    let customProfileAmt = 2;
    let onlineServiceAmt = 1;

    if (period === "yearly")
    {
        largeStoragePrice.innerText = `+$${largeStorageAmt * 10}/yr`;
        customProfilePrice.innerText = `+$${customProfileAmt * 10}/yr`;
        onlineServicePrice.innerText = `+$${onlineServiceAmt * 10}/yr`;
        return;
    }

    largeStoragePrice.innerText = `+$${largeStorageAmt}/mo`;
    customProfilePrice.innerText = `+$${customProfileAmt}/mo`;
    onlineServicePrice.innerText = `+$${onlineServiceAmt}/mo`;

}
// TODO: add data then submit and change event
function updateTable(){
    // const subPlan = document.getElementsByName("sub_plan");
    const subPlan = document.querySelectorAll("input[name=sub_plan]");
    subPlan.forEach(plan =>{
        if(plan.checked){
            console.log(plan.value);

        }
    });


}
const validateEmail = email =>
{
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const errorState = (function (id, errMsg)
{
    const label = document.querySelector(`#step1 > label[for=${id}]`);
    label.insertAdjacentHTML("beforeend", `<span class=error_state>${errMsg}</span>`);
    return false;
});