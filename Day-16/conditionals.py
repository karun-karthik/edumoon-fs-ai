# if, elif, else

# age = input("Enter your age:")
# age = int(age)
# age = int(input("Enter your age:"))

# if age < 18:
#     print("You are underage")
# elif age > 25:
#     print("You are an adult")
# else:
#     print("You are a major")

# if age < 18:
#     if age < 13:
#         print("You are a child")
#     else:
#         print("You are a teenager")
# elif age > 25:
#     print("You are an adult")
# else:
#     print("You are a major")

# for, while, do while

# print(range(i)) [0, i) ~ [0, i-1]

# for i in range(5):
#     print("i = ", i)

# print("-----__________\n")

# for j in range(3, 5):
#     print("j = ", j)

# print("--------------\n")

# for k in range(1, 11, 2): # [start, end-1, step/skip]
#     print("k = ", k);

# print("___________While\n")

# j = 1
# while j < 5:
#     print(" j = ", j)
#     j += 1
# else:
#     print("Exited")

while True:
    a = int(input("Enter value?"))
    if a == 5:
        # exit()
        break
    if a == 9:
        # print("9 is selected")
        pass # this is a placeholder
        # continue
    else:
        print("a = ", a)
    print("This is the end line")