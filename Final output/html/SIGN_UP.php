<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Iloilo Travelogue</title>
    <link rel="stylesheet" href="../DESIGN.css">
    <link rel="icon" href="../assets/logo.png" sizes="32x32" type="image/png">
    <link rel="shortcut icon" href="../assets/logo.png">
</head>

<body>
    <div class="signup-wrapper">
        <img id="logo" src="../assets/logo.png">
        <h1>Sign Up</h1>
            <p id="error-message"></p>
            
            <form action= "SIGN_UP.php" method= "post">

                <?php
                if (isset($_POST["submit"])) {
                    $fullname = $_POST["fullname"];
                    $email = $_POST["email"];
                    $date = $_POST["birthday"];
                    $password = $_POST["password"];
                    $passwordRepeat = $_POST["repeat-password"];

                    $password_hash =password_hash($password, PASSWORD_DEFAULT);
                    $errors = array();

                    //ERROR MESSAGES AND VERIFICATION
                    if (empty($fullname) OR empty($email) OR empty($date) OR empty($password) OR empty($passwordRepeat)) {
                        array_push($errors, "All fields are required");
                    }
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        array_push($errors, "Email is not valid");
                    }
                    if (strlen($password)<8) {
                        array_push($errors, "Password must be atleast 8 characters long");
                    }
                    if ($password!=$passwordRepeat) {
                        array_push($errors, "Password does not match");
                    }
                    require_once "../data/database.php";
                    $sql = "SELECT * FROM users WHERE email = '$email'";
                    $result = mysqli_query($conn, $sql);
                    $rowCount = mysqli_num_rows ($result);
                    if ($rowCount>0) {
                        array_push($errors, "Email already exists!");
                    }
                    if (count($errors)>0){
                        foreach ($errors as $error) {
                            echo "<div class='alert alert-danger'>$error</div>";
                        }
                    }else{
                        require_once "../data/database.php";
                        $sql = "INSERT INTO users (full_name, email, birthday, password) VALUES (?,?,?,?)";
                        $stmt = mysqli_stmt_init($conn);
                        $prepareStmt = mysqli_stmt_prepare($stmt, $sql);
                        if ($prepareStmt) {
                            mysqli_stmt_bind_param($stmt,"ssss",$fullname,$email,$date,$password_hash);
                            mysqli_stmt_execute($stmt);
                            echo "<div class='alert alert-success'>You have registered successfully.</div>";
                        } else {
                            die("Something went wrong");
                        }
                    }
                }
                ?>

                <div class="form-group">
                    <input type="text" id="name-input" name="fullname" placeholder="Full Name">
                </div>
                <div class="form-group">
                    <input type="text" id="email-input" name="email" placeholder="Email">
                </div>
                <div class="form-group">
                    <input type="date" id="birthday-input" name="birthday">
                </div>
                <div class="form-group">
                    <input type="password" id="password-input" name="password" placeholder="Password">
                </div>
                <div class="form-group">
                    <input type="password" id="repeat-password-input" name="repeat-password" placeholder="Repeat Password">
                </div>
                <div class="form-btn">
                    <input type="submit" id="y-button" value="Register" name="submit">
                </div>
            </form>
            
            <a id="login-link" href="LOGIN.php">Already have an account? Login</a>
    </div>
</body>
</html>