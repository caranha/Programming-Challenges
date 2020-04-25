while True:
    try:
        line = input()
        max = 0
        tk = line.split()
        i, j = int(tk[0]), int(tk[1])
        for n in range(i, j+1):
            count = 1
            while n != 1:
                if n % 2 == 1:
                    n = 3*n + 1
                else:
                    n = n / 2
                count += 1
            if count > max:
                max = count
        print (line, max)
    except EOFError: break
