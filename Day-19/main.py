from hello import sayHello
import math

# try:
#     # x = 10/10
#     x = 10/0
#     print(x)
# # except ZeroDivisionError:
# #     print("Error: Division by zero is not allowed.")
# except Exception as e:
#     print(f"An unexpected error occurred: {e}")
# finally:
#     print("This is printed always")

class Human:
    # this ~ self
    '''
    self = {}
    self.name ~ {"name": "John"}
    '''
    def __init__(self, name):
        self.name = name
    
    def talk(self):
        print(f"I'm {self.name}")
    
class Teacher(Human):
    def __init__(self, name, subject):
        super().__init__(name)
        self.subject = subject
    
    def teach(self):
        print(f"I teach {self.subject}")
    
    def talk(self):
        print("Something")

my_human = Human("John")
'''
self = {}
self.name ~ {"name": "John"}
'''

another_human = Human("Doe")
'''
self = {}
self.name ~ {"name": "Doe"}
'''

# my_human.talk()
# another_human.talk()

# science_teacher = Teacher("Walter", "Chemistry")
# science_teacher.talk()
# science_teacher.teach()

sayHello()

print(math.pi)
print(math.e)

# with open("file.txt", "w") as file:
#     file.write("Hello, this is a sample file.\n")
#     file.write("Hello, this is a second line.\n")
#     file.write("Hello, this is a third line.\n")

with open("file.txt", "r") as file:
    print(file.read())