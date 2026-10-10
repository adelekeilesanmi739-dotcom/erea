// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://tqnvudjlknsmvhdvjrie.supabase.co";
const SUPABASE_KEY = "sb_publishable_GolF_xu-ZHfRGfTOuhzdnw_T9AUmyhw";

const { createClient } = supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';
    }

});


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        loginMessage.textContent =
            "Please enter your email and password.";

        loginMessage.style.color = "red";

        return;
    }


    loginMessage.textContent =
        "Logging you in...";

    loginMessage.style.color =
        "#00143d";


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {
            throw error;
        }


        console.log("Logged in user:", data.user);


        loginMessage.textContent =
            "Login successful!";

        loginMessage.style.color =
            "green";


        // SEND USER TO DASHBOARD

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 500);


    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            error.message;

        loginMessage.style.color =
            "red";
    }

});