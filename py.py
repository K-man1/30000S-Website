import turtle
import time

# -------------------- Screen --------------------
screen = turtle.Screen()
screen.setup(width=600, height=600)
screen.title("Seeker Game")

# -------------------- Counter Turtle --------------------
counter = turtle.Turtle()
counter.hideturtle()
counter.penup()
counter.goto(0, 250)

counter_font = ("Arial", 24, "normal")

timer = 30
counter_interval = 1000
timer_up = False
game_over = False

# -------------------- Drawer Turtle --------------------
drawer = turtle.Turtle()
drawer.penup()
drawer.goto(-200, -200)
drawer.pendown()

for _ in range(4):
    drawer.forward(400)
    drawer.left(90)

drawer.hideturtle()

# -------------------- Seeker Turtle --------------------
seeker = turtle.Turtle()
seeker.shape("turtle")
seeker.color("red")
seeker.penup()

mode = screen.textinput("Difficulty", "Easy, medium, or hard mode?")

if mode == "easy":
    seeker.speed(1)
elif mode == "medium":
    seeker.speed(6)
else:
    seeker.speed(10)

# -------------------- Color Selection --------------------
colors = ["blue", "green", "purple", "black", "orange"]
print(colors)

color_choice = screen.textinput("Color", "Choose a color:")

# -------------------- User Turtle --------------------
user = turtle.Turtle()
user.shape("turtle")
user.color(color_choice)
user.penup()
user.goto(-100,100)

# -------------------- Movement Functions --------------------
def move_forward():
    user.forward(10)

def move_back():
    user.setheading(180)

def move_left():
    user.setheading(-90)

def move_right():
    user.right(90)


# -------------------- Countdown Function --------------------
def countdown():
    global timer, game_over

    counter.clear()

    if timer <= 0:
        counter.write("Time's Up", align="center", font=counter_font)
        game_over = True
        print("You win!")
        return
    else:
        counter.write(timer, align="center", font=counter_font)
        timer -= 1

    seeker.setheading(seeker.towards(user))
    seeker.forward(5)

    if seeker.distance(user) < 20:
        game_over = True
        print("Game Over, you lost")
        return

    screen.ontimer(countdown, counter_interval)

# -------------------- Key Bindings --------------------
screen.listen()
screen.onkey(move_forward, "w")
screen.onkey(move_back, "s")
screen.onkey(move_left, "a")
screen.onkey(move_right, "d")

# -------------------- Start Game --------------------
countdown()
screen.mainloop()
