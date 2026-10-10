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
// REGISTRATION
// ==========================================

const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // CHECK PASSWORD LENGTH

    if (password.length < 6) {

        registerMessage.textContent =
            "Password must be at least 6 characters.";

        registerMessage.style.color = "red";

        return;
    }


    // CHECK PASSWORD MATCH

    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        registerMessage.style.color = "red";

        return;
    }


    registerMessage.textContent =
        "Creating your account...";

    registerMessage.style.color = "#00143d";


    try {

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {
                    data: {
                        full_name: name
                    }
                }

            });


        if (error) {
            throw error;
        }


        console.log("Registered user:", data);


        registerMessage.textContent =
            "Account created successfully! Check your email to verify your account.";

        registerMessage.style.color =
            "green";


        registerForm.reset();


    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            error.message;

        registerMessage.style.color =
            "red";
    }

});