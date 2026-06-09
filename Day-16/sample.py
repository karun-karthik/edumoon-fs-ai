# print("Hey there" + " !", end=",")
'''
Hey is a multiline comment
'''
# print(input("Enter your name"))

x = 6
name = "14"
sample = "12.42"
height = 5.9
is_student = True #true, false
no_value = None # undefined

# print(x + name)

print(x)
print(name)
print(sample)
print(height)
print(is_student)
print(no_value)

print(type(x))
print(type(name))
print(type(sample))
print(type(height))
print(type(is_student))
print(type(no_value))

print(name + name)
print(name + str(x))
print(int(name) + x)
print(x * 3)
print(name * 3)
# print(type(str(x)))

print(int("101", 2))
'''
00 - 0
01 - 1
10 - 2
11 - 3
100 - 4
101 - 5
'''

print(float(sample) + 1)

print("----------Operators----------")

x = 2
y = 3

print(x + y)
print(x - y)
print(x * y)
print(x / y) # division
print(x // y) # floor division
print(x % y)
print(x ** y) # x to the power of y

print("----------Comparision----------")
print(x == y)
print(x != y)
print(x > y)
print(x < y)
print(x >= y)
print(x <= y)

print("----------Logical----------")
print(x == 2 and y >= 3) # early exit operator
print(x > 2 or y >= -1)
print(not(x > 1))

print("----------Assignment----------")
# +=, -=, *=, /=, //=, %=, **=
x += 10 #x = x + 10
print(x)

