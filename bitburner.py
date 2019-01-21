def stocks(arr):
    maximum = float('-Infinity')
    start = arr[0]
    
    for element in arr[1:]:
        if element < start:
            start = element
        else:
            localMaximum = element - start
            if localMaximum > maximum:
                maximum = localMaximum

    return maximum

def stocksMult(arr):
    profit = 0
    bought = None

    for el in range(len(arr) - 1):
        current = arr[el]
        peek = arr[el + 1]
        if bought != None and peek < current:
            profit += current - bought
            bought = None
        elif bought == None and peek > current:
            bought = current
            # profit is a word that means revenue - expense
            # not according to the game it doesn't!
            # profit -= current
    
    if bought:
        profit += arr[-1] - bought

    return profit


def largestPrimeFactor(prime):
    while prime % 2 == 0:
        prime //= 2
    
    odd = 3
    while odd * odd <= prime:
        if prime % odd == 0:
            prime //= odd
        else:
            odd += 2

    return prime
