/* =========================================
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://tqnvudjlknsmvhdvjrie.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_GolF_xu-ZHfRGfTOuhzdnw_T9AUmyhw";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================
   GLOBAL STATE
========================================= */

let currentUser = null;

let currentProfile = null;


/* =========================================
   PAGE START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupMobileMenu();

        setupModalClickOutside();

        await loadDashboard();

    }
);


/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth.getSession();


        if (
            sessionError ||
            !sessionData.session
        ) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            sessionData.session.user;


        await loadProfile();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showToast(
            "Unable to load your dashboard.",
            "error"
        );

    }

}


/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "id, full_name, email, balance, vip_level, total_earnings, withdrawn"
            )
            .eq(
                "id",
                currentUser.id
            )
            .single();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        showToast(
            "Unable to load your profile.",
            "error"
        );

        return;
    }


    currentProfile = data;


    updateProfileUI();

}


/* =========================================
   UPDATE PROFILE UI
========================================= */

function updateProfileUI() {

    const name =
        currentProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        "User";


    const email =
        currentProfile?.email ||
        currentUser?.email ||
        "";


    const balance =
        Number(
            currentProfile?.balance || 0
        );


    const totalEarnings =
        Number(
            currentProfile?.total_earnings || 0
        );


    const withdrawn =
        Number(
            currentProfile?.withdrawn || 0
        );


    const vip =
        Number(
            currentProfile?.vip_level || 0
        );


    const firstLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    setText(
        "welcomeName",
        `Hello, ${name}`
    );


    setText(
        "sidebarName",
        name
    );


    setText(
        "sidebarEmail",
        email
    );


    setText(
        "headerUserName",
        name
    );


    setText(
        "balance",
        formatNaira(balance)
    );


    setText(
        "totalEarnings",
        formatNaira(totalEarnings)
    );


    setText(
        "withdrawnAmount",
        formatNaira(withdrawn)
    );


    setText(
        "vipLevel",
        `VIP ${vip}`
    );


    setText(
        "profileName",
        name
    );


    setText(
        "profileEmail",
        email
    );


    setText(
        "profileVip",
        `VIP ${vip}`
    );


    setText(
        "profileBalance",
        formatNaira(balance)
    );


    setText(
        "sidebarAvatar",
        firstLetter
    );


    setText(
        "headerAvatar",
        firstLetter
    );


    setText(
        "profileAvatar",
        firstLetter
    );


    const referral =
        `${window.location.origin}/register.html?ref=${currentUser.id}`;


    setText(
        "referralLink",
        referral
    );

}


/* =========================================
   NAVIGATION
========================================= */

function showSection(section) {

    document
        .querySelectorAll(
            ".dashboard-section"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active-section"
                )
        );


    const target =
        document.getElementById(
            `section-${section}`
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                section
            ) {

                item.classList.add(
                    "active"
                );

            }

        });


    document
        .querySelectorAll(
            ".mobile-nav-item"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    closeMobileMenu();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuBtn"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const sidebar =
                document.getElementById(
                    "sidebar"
                );

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


function closeMobileMenu() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }

}


/* =========================================
   MODALS
========================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");

    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");

    document.body.style.overflow =
        "";

}


/* =========================================
   MODAL OUTSIDE CLICK
========================================= */

function setupModalClickOutside() {

    document
        .querySelectorAll(
            ".modal-overlay"
        )
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        modal.classList.remove(
                            "open"
                        );

                        document.body.style.overflow =
                            "";

                    }

                }
            );

        });

}


/* =========================================
   RECHARGE
========================================= */

function openRecharge() {

    openModal(
        "rechargeModal"
    );

}


async function startRecharge() {

    const amountInput =
        document.getElementById(
            "rechargeAmount"
        );

    const button =
        document.getElementById(
            "rechargeButton"
        );


    const amount =
        Number(
            amountInput.value
        );


    if (
        !Number.isFinite(amount) ||
        amount < 100
    ) {

        showToast(
            "Minimum recharge is ₦100.",
            "error"
        );

        return;
    }


    try {

        button.disabled = true;

        button.textContent =
            "Preparing payment...";


        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "initialize-payment",
                    {
                        body: {
                            amount
                        }
                    }
                );


        if (error) {

            throw new Error(
                error.message ||
                "Unable to start payment."
            );

        }


        if (
            !data?.authorization_url
        ) {

            throw new Error(
                data?.error ||
                "Payment link was not returned."
            );

        }


        window.location.href =
            data.authorization_url;


    } catch (error) {

        console.error(
            "Recharge error:",
            error
        );

        showToast(
            error.message ||
            "Unable to start recharge.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Continue to Payment";

    }

}


/* =========================================
   WITHDRAW
========================================= */

function openWithdraw() {

    openModal(
        "withdrawModal"
    );

}


async function submitWithdrawal() {

    const amount =
        Number(
            document.getElementById(
                "withdrawAmount"
            ).value
        );


    const bankCode =
        document.getElementById(
            "bankCode"
        ).value.trim();


    const accountNumber =
        document.getElementById(
            "accountNumber"
        ).value.trim();


    const button =
        document.getElementById(
            "withdrawButton"
        );


    if (
        !Number.isFinite(amount) ||
        amount < 100
    ) {

        showToast(
            "Minimum withdrawal is ₦100.",
            "error"
        );

        return;
    }


    if (
        !/^\d{3,6}$/.test(
            bankCode
        )
    ) {

        showToast(
            "Enter a valid bank code.",
            "error"
        );

        return;
    }


    if (
        !/^\d{10}$/.test(
            accountNumber
        )
    ) {

        showToast(
            "Account number must contain 10 digits.",
            "error"
        );

        return;
    }


    try {

        button.disabled = true;

        button.textContent =
            "Processing...";


        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "create-withdrawal",
                    {
                        body: {
                            amount,
                            bank_code:
                                bankCode,
                            account_number:
                                accountNumber
                        }
                    }
                );


        if (error) {

            throw new Error(
                error.message ||
                "Withdrawal failed."
            );

        }


        if (!data?.success) {

            throw new Error(
                data?.error ||
                "Withdrawal could not be completed."
            );

        }


        if (
            typeof data.balance !==
            "undefined"
        ) {

            updateDashboardBalance(
                data.balance
            );

        }


        closeModal(
            "withdrawModal"
        );


        showToast(
            "Withdrawal request submitted successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Withdrawal error:",
            error
        );

        showToast(
            error.message ||
            "Withdrawal failed.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Withdraw Funds";

    }

}


/* =========================================
   VIP
========================================= */

async function buyVIP(level) {

    const prices = {

        1: 1000,

        2: 5000,

        3: 10000,

        4: 20000,

        5: 50000,

        6: 100000

    };


    const amount =
        prices[level];


    if (!amount) {

        showToast(
            "Invalid VIP level.",
            "error"
        );

        return;
    }


    try {

        const {
            data: userData,
            error: userError
        } =
            await supabaseClient
                .auth
                .getUser();


        if (
            userError ||
            !userData?.user
        ) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            userData.user;


        showToast(
            "Preparing VIP payment...",
            "info"
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "initialize-vip",
                    {
                        body: {
                            vip_level:
                                level
                        }
                    }
                );


        if (error) {

            throw new Error(
                error.message ||
                "Unable to initialize VIP payment."
            );

        }


        if (
            !data?.authorization_url
        ) {

            throw new Error(
                data?.error ||
                "VIP payment link was not returned."
            );

        }


        window.location.href =
            data.authorization_url;


    } catch (error) {

        console.error(
            "VIP error:",
            error
        );

        showToast(
            error.message ||
            "Unable to start VIP payment.",
            "error"
        );

    }

}


/* =========================================
   SPIN & WIN
========================================= */

function openSpinWin() {

    const panel =
        document.getElementById(
            "spinPanel"
        );


    if (!panel) {

        showToast(
            "Spin & Win panel could not be found.",
            "error"
        );

        return;
    }


    panel.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


function closeSpinWin() {

    const panel =
        document.getElementById(
            "spinPanel"
        );


    if (panel) {

        panel.classList.remove(
            "open"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================
   SPIN
========================================= */

async function spinWheel() {

    const button =
        document.getElementById(
            "spinButton"
        );


    const wheel =
        document.getElementById(
            "spinWheel"
        );


    const resultBox =
        document.getElementById(
            "spinResult"
        );


    const stakeSelect =
        document.getElementById(
            "spinStake"
        );


    if (
        !button ||
        !wheel ||
        !resultBox ||
        !stakeSelect
    ) {

        showToast(
            "Spin & Win is not configured correctly.",
            "error"
        );

        return;
    }


    try {

        button.disabled = true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> PROCESSING...';


        resultBox.innerHTML =
            "";


        const {
            data: userData,
            error: userError
        } =
            await supabaseClient
                .auth
                .getUser();


        if (
            userError ||
            !userData?.user
        ) {

            throw new Error(
                "Your session has expired. Please log in again."
            );

        }


        const stake =
            Number(
                stakeSelect.value
            );


        if (
            ![
                100,
                200,
                500,
                1000,
                2000,
                5000
            ].includes(stake)
        ) {

            throw new Error(
                "Invalid stake amount."
            );

        }


        /*
          IMPORTANT:

          The browser only sends the stake.
          The server decides the result.
        */

        const response =
            await supabaseClient
                .functions
                .invoke(
                    "play-spin",
                    {
                        body: {
                            stake
                        }
                    }
                );


        console.log(
            "PLAY-SPIN RESPONSE:",
            response
        );


        if (response.error) {

            let message =
                response.error.message ||
                "Spin server returned an error.";


            /*
              Attempt to extract the
              actual Edge Function message.
            */

            if (
                response.error.context &&
                typeof response.error.context.json ===
                    "function"
            ) {

                try {

                    const serverResponse =
                        await response.error.context.json();


                    if (
                        serverResponse?.error
                    ) {

                        message =
                            serverResponse.error;

                    }

                } catch {

                    // Keep original error.

                }

            }


            throw new Error(
                message
            );

        }


        const data =
            response.data;


        if (
            !data?.success
        ) {

            throw new Error(
                data?.error ||
                "Spin could not be completed."
            );

        }


        /*
          Animate wheel AFTER
          server result is received.
        */

        await animateRealWheel(
            data.result
        );


        const payout =
            Number(
                data.payout || 0
            );


        const multiplier =
            Number(
                data.multiplier || 0
            );


        if (payout > 0) {

            resultBox.innerHTML = `

                <div class="spin-result-title">
                    🎉 ${escapeHtml(
                        data.result
                    )}
                </div>

                <div class="spin-result-multiplier">
                    ${multiplier}x
                </div>

                <div class="spin-result-payout">
                    You won
                    ₦${payout.toLocaleString(
                        "en-NG"
                    )}
                </div>

            `;


            showToast(
                `You won ₦${payout.toLocaleString("en-NG")}!`,
                "success"
            );


        } else {

            resultBox.innerHTML = `

                <div class="spin-result-loss">
                    ${escapeHtml(
                        data.result
                    )}
                </div>

                <div style="margin-top:4px;">
                    Better luck next time.
                </div>

            `;


            showToast(
                "Better luck next time.",
                "info"
            );

        }


        /*
          Update wallet immediately.
        */

        if (
            typeof data.balance !==
            "undefined"
        ) {

            updateDashboardBalance(
                data.balance
            );

        }


    } catch (error) {

        console.error(
            "SPIN ERROR:",
            error
        );


        resultBox.innerHTML = `

            <div class="spin-result-loss">
                ❌ ${escapeHtml(
                    error.message ||
                    "Spin failed."
                )}
            </div>

        `;


        showToast(
            error.message ||
            "Spin failed.",
            "error"
        );


    } finally {

        /*
          This guarantees that the
          button never remains stuck
          on PROCESSING.
        */

        button.disabled = false;

        button.innerHTML =
            '<i class="fa-solid fa-play"></i> SPIN NOW';

    }

}




/* =========================================
   WHEEL ANIMATION
========================================= */

async function animateRealWheel(
    result
) {

    const wheel =
        document.getElementById(
            "spinWheel"
        );


    if (!wheel) return;


    const resultIndex = {

        "Better Luck": 0,

        "Small Win": 1,

        "Nice Win": 2,

        "Big Win": 3,

        "Mega Win": 4,

        "Jackpot": 5

    };


    const index =
        resultIndex[result] ?? 0;


    /*
      Segment center.
    */

    const segmentCenter =
        index * 60 + 30;


    /*
      Multiple full rotations
      before landing.
    */

    const fullRotations =
        6 * 360;


    const target =
        fullRotations +
        (360 - segmentCenter);


    wheel.style.transition =
        "none";


    wheel.style.transform =
        "rotate(0deg)";


    void wheel.offsetWidth;


    wheel.style.transition =
        "transform 4.6s cubic-bezier(.12,.72,.15,1)";


    wheel.style.transform =
        `rotate(${target}deg)`;


    await new Promise(
        resolve => {

            setTimeout(
                resolve,
                4700
            );

        }
    );

}


/* =========================================
   INVITE
========================================= */

function openInvite() {

    openModal(
        "inviteModal"
    );

}


async function copyReferralLink() {

    const link =
        document.getElementById(
            "referralLink"
        )?.textContent;


    if (!link) {

        showToast(
            "Referral link unavailable.",
            "error"
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            link
        );


        showToast(
            "Referral link copied.",
            "success"
        );


    } catch {

        showToast(
            "Unable to copy referral link.",
            "error"
        );

    }

}


/* =========================================
   WEALTH
========================================= */

function openWealth() {

    openModal(
        "wealthModal"
    );

}


/* =========================================
   PROFILE
========================================= */

function openProfile() {

    openModal(
        "profileModal"
    );

}


/* =========================================
   TRANSACTIONS
========================================= */

async function loadTransactions(
    type = "all",
    button = null
) {

    document
        .querySelectorAll(
            ".transaction-tab"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    const list =
        document.getElementById(
            "transactionList"
        );


    if (!list) return;


    list.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <h3>
                Loading transactions...
            </h3>

        </div>

    `;


    try {

        let query =
            supabaseClient
                .from("wallet_transactions")
                .select(
                    "id,type,status,amount,currency,reference,provider,created_at"
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(50);


        if (
            type !== "all"
        ) {

            query =
                query.eq(
                    "type",
                    type
                );

        }


        const {
            data,
            error
        } =
            await query;


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            list.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-receipt"></i>

                    <h3>
                        No transactions yet
                    </h3>

                    <p>
                        Your wallet activity will appear here.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML =
            data.map(
                transaction =>
                    createTransactionHTML(
                        transaction
                    )
            ).join("");


    } catch (error) {

        console.error(
            error
        );


        list.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>
                    Unable to load transactions
                </h3>

                <p>
                    Please try again.
                </p>

            </div>

        `;

    }

}


/* =========================================
   TRANSACTION HTML
========================================= */

function createTransactionHTML(
    transaction
) {

    const isDeposit =
        transaction.type ===
        "deposit";


    const amount =
        Number(
            transaction.amount || 0
        );


    const date =
        new Date(
            transaction.created_at
        ).toLocaleString(
            "en-NG"
        );


    return `

        <div
            style="
                display:flex;
                align-items:center;
                gap:12px;
                padding:15px 20px;
                border-bottom:1px solid #eef0f3;
            "
        >

            <div
                style="
                    width:38px;
                    height:38px;
                    border-radius:10px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:${isDeposit ? "#ecfdf5" : "#fff1f2"};
                    color:${isDeposit ? "#16a34a" : "#dc2626"};
                "
            >

                <i class="fa-solid ${
                    isDeposit
                        ? "fa-arrow-down"
                        : "fa-arrow-up"
                }"></i>

            </div>


            <div style="flex:1;">

                <strong
                    style="
                        display:block;
                        font-size:11px;
                    "
                >
                    ${
                        isDeposit
                            ? "Deposit"
                            : "Withdrawal"
                    }
                </strong>

                <span
                    style="
                        display:block;
                        color:#9ca3af;
                        font-size:9px;
                        margin-top:3px;
                    "
                >
                    ${date}
                </span>

            </div>


            <div
                style="
                    text-align:right;
                "
            >

                <strong
                    style="
                        display:block;
                        font-size:11px;
                        color:${isDeposit ? "#16a34a" : "#dc2626"};
                    "
                >
                    ${
                        isDeposit
                            ? "+"
                            : "-"
                    }₦${amount.toLocaleString("en-NG")}
                </strong>

                <span
                    style="
                        display:block;
                        font-size:8px;
                        color:#9ca3af;
                        margin-top:3px;
                    "
                >
                    ${transaction.status}
                </span>

            </div>

        </div>

    `;

}


/* =========================================
   UPDATE BALANCE
========================================= */

function updateDashboardBalance(
    balance
) {

    const numericBalance =
        Number(
            balance || 0
        );


    if (
        currentProfile
    ) {

        currentProfile.balance =
            numericBalance;

    }


    setText(
        "balance",
        formatNaira(
            numericBalance
        )
    );


    setText(
        "profileBalance",
        formatNaira(
            numericBalance
        )
    );

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .signOut();


        if (error) {

            throw error;

        }


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Unable to logout. Please try again.",
            "error"
        );

    }

}


/* =========================================
   TOAST
========================================= */

function showToast(
    message,
    type = "info"
) {

    const container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        alert(message);

        return;

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast ${type}`;


    let icon =
        "fa-circle-info";


    if (
        type === "success"
    ) {

        icon =
            "fa-circle-check";

    }


    if (
        type === "error"
    ) {

        icon =
            "fa-circle-exclamation";

    }


    toast.innerHTML = `

        <i class="fa-solid ${icon}"></i>

        <span>
            ${escapeHtml(message)}
        </span>

    `;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(20px)";

            setTimeout(
                () =>
                    toast.remove(),
                250
            );

        },
        3500
    );

}


/* =========================================
   HELPERS
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function formatNaira(
    amount
) {

    return `₦${Number(
        amount || 0
    ).toLocaleString(
        "en-NG",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

}


function escapeHtml(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}