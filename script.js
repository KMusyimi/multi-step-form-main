
const next = document.querySelector(".next");
const previous = document.querySelector(".previous");

const steps = document.querySelectorAll(".step");

const stepWidth = document.querySelector(".step").offsetWidth;

const form = document.querySelector(".form");
const change = document.querySelector(".change");

const checkbox = document.querySelector("#period");
const emptyField = "This field is required";


const userData = {
    username: "",
    email: "",
    phoneNumber: "",
    subscription: {
        plan: "",
        price: "",
        period: "Monthly",
        freeTrial: 0,
    },
    addOns: [],
    total: 0,
    issueFreeTrial: months =>
    {
        userData.subscription.freeTrial = months;
    }
}

let arcadeAmt = 0;
let advanceAmt = 0;
let proAmt = 0;

let largeStorageAmt = 0;
let customProfileAmt = 0;
let onlineServiceAmt = 0;

let counter = 1;
let period = "mo";

document.addEventListener("DOMContentLoaded", () =>
{
    form.reset();
    populatePlanPrices();
    populateAddOnsPrices();

    userData.issueFreeTrial(freeTrialMonths());

    checkbox.addEventListener("change", checkBoxEvt);
    change.addEventListener("click", changePlanEvt);


    next.addEventListener("click", function ()
    {
        if (!validateForm()) return;
        removeActiveTab(steps);
        counter++;
        const nextStep = document.querySelector(`#step${counter}`);

        nextStep.style.transform = `translateX(${stepWidth}px)`;
        nextStep.classList.add("active");
        stepIndicator();
        updateTable();
        changeBtnText();

    });

    previous.addEventListener("click", function ()
    {
        removeActiveTab(steps);
        counter--;
        stepIndicator();

        const prevStep = document.querySelector(`#step${counter}`);
        prevStep.style.transform = `translateX(-${stepWidth}px)`;
        prevStep.classList.add("active");
        changeBtnText();
    });
});



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


function changeBtnText()
{
    if (counter < steps.length - 1)
    {
        next.innerText = "Next Step";
        return
    }
    next.innerText = "Confirm";
    next.setAttribute("type", "submit");
    next.className = "confirm btn";
}

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
    userData.username = fname;
    userData.email = email;
    userData.phoneNumber = phoneNumber;
    return valid;
});


const checkBoxEvt = (function ()
{

    const plans = document.querySelectorAll(".plan");
    const freeTrials = document.querySelectorAll(".free_trial");


    if (this.checked)
    {
        let html = `<span class=free_trial>${userData.subscription.freeTrial} months free</span>`;
        period = "yr";
        userData.subscription.period = "Yearly";
        plans.forEach(plan =>
        {
            plan.insertAdjacentHTML("beforeend", html);
        });
    }else{
        for (let i = 0; i < freeTrials.length; i++)
        {
            plans[i].removeChild(freeTrials[i]);
        }
    
        userData.subscription.period = "Monthly";
    
        period = "mo";
    }
    populatePlanPrices();
    populateAddOnsPrices();

});

function populatePlanPrices()
{
    const arcadePricing = document.querySelector(".price_arcade");
    const advancePricing = document.querySelector(".price_advance");
    const proPricing = document.querySelector(".price_pro");

    arcadeAmt = calcPricePeriod(9);
    advanceAmt = calcPricePeriod(12);
    proAmt = calcPricePeriod(15);

    arcadePricing.innerText = `$${arcadeAmt}/${period}`;
    advancePricing.innerText = `$${advanceAmt}/${period}`;
    proPricing.innerText = `$${proAmt}/${period}`;
}

function populateAddOnsPrices()
{
    const largeStoragePrice = document.querySelector("#large_storage + label .price_add_ons");
    const customProfilePrice = document.querySelector("#customizable_profile + label .price_add_ons");
    const onlineServicePrice = document.querySelector("#online_service + label .price_add_ons");

    largeStorageAmt = calcPricePeriod(2);
    customProfileAmt = calcPricePeriod(2);
    onlineServiceAmt = calcPricePeriod(1);


    largeStoragePrice.innerText = `+$${largeStorageAmt}/${period}`;
    customProfilePrice.innerText = `+$${customProfileAmt}/${period}`;
    onlineServicePrice.innerText = `+$${onlineServiceAmt}/${period}`;

}

const freeTrialMonths = (function ()
{
    return 2;
})

function calcPricePeriod(amt)
{
    const monthsInYear = 12;
    if (userData.subscription.period == "Yearly")
    {

        return amt * (monthsInYear - userData.subscription.freeTrial);
    }
    return amt;

}
// TODO: add data then submit and change event
function updateTable()
{
    const tbody = document.querySelector(".t_body");

    const step = document.querySelector("#step4");
    const th_head = document.querySelector(".row-main .plan");

    const row_sec = document.querySelectorAll(".row-sec");
    const th_amt = document.querySelector(".row-main .amt");

    const tf_period = document.querySelector(".row-footer .period");
    const tf_total = document.querySelector(".row-footer .total");

    const plan = document.querySelector("input[name=sub_plan]:checked");


    if (step.classList.contains("active"))
    {
        if (row_sec.length > 0)
        {
            userData.addOns = [];
            row_sec.forEach(row =>
            {
                tbody.removeChild(row);
            })

        }
        userData.subscription.plan = plan.value;

        tf_period.innerText = "month";

        if (userData.subscription.period == "Yearly")
        {
            tf_period.innerText = "year";
        }

        switch (plan.value)
        {
            case "Arcade":
                userData.subscription.price = arcadeAmt;
                break;
            case "Advanced":
                userData.subscription.price = advanceAmt;
                break;
            case "Pro":
                userData.subscription.price = proAmt;
                break;

        }


        th_head.innerHTML = `${userData.subscription.plan}(<span class="period">${userData.subscription.period}</span>)`;

        th_amt.innerText = `$${userData.subscription.price}/${period}`;

        tableAddOnsData(tbody);

        const total = getTotalPrice();

        tf_total.innerText = `+${total}/${period}`;

        console.log('userData :>> ', userData);

    }
}

function changePlanEvt(evt)
{
    evt.preventDefault();
    const currentStep = document.querySelector("#step4");
    counter = 2;

    const nextStep = document.querySelector(`#step${counter}`);

    currentStep.classList.remove("active");

    removeActiveTab(steps);
    stepIndicator();

    nextStep.style.transform = `translateX(-${stepWidth * counter}px)`;
    nextStep.classList.add("active");

    changeBtnText();
}

const validateEmail = email =>
{
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getTotalPrice = (function ()
{
    let amt = 0;
    let planAmt = userData.subscription.price;
    if (userData.addOns.length > 0)
    {
        userData.addOns.forEach(addOn =>
        {
            amt += addOn.price;
        })
    }
    userData.total = planAmt + amt;
    return userData.total;
}
);

const tableAddOnsData = (function (tbody)
{

    const addOns = document.querySelectorAll("#step3 .input_wrapper > input:checked");

    let html = "";


    if (addOns.length > 0)
    {
        addOns.forEach(addOn =>
        {
            let h_text = document.querySelector(`.form-checkbox:checked[value=${addOn.value}] + label > main h5`).innerText;

            let addOnsData = {
                addOn: "",
                price: ""
            }

            switch (addOn.value)
            {
                case "online_service":
                    addOnsData.price = onlineServiceAmt;
                    break;
                case "large_storage":
                    addOnsData.price = largeStorageAmt;
                    break;
                case "customizable_profile":
                    addOnsData.price = customProfileAmt;
                    break;
            }

            addOnsData.addOn = h_text;

            userData.addOns.push(addOnsData);


            html += `
                    <tr class="row row-sec d-flx ali-c">
                        <td class="add-on">${addOnsData.addOn}</td>
                        <td class="amt">+$${addOnsData.price}/${period}</td>
                    </tr>
                    `;
        })
    } else
    {
        html = `
                <tr class="row row-sec d-flx ali-c">
                    <td class="add-on">No add-ons</td>
                    <td class="amt">$0/${period}</td>
                </tr>
                `;
    }
    tbody.insertAdjacentHTML("beforeend", html);

});

const errorState = (function (id, errMsg)
{
    const label = document.querySelector(`#step1 > label[for=${id}]`);
    label.insertAdjacentHTML("beforeend", `<span class=error_state>${errMsg}</span>`);
    return false;
});