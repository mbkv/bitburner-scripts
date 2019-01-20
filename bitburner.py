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
