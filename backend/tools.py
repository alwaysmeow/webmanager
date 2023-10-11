def authentication(login, passwordHash):
    if login == 'meowmeow' and passwordHash == '8508f1792bd3b9b9b7fc0d618f03f23eaf04cc53cab5542d175fbbeab547d609': # homosapien
        return True
    elif login == 'barkbark' and passwordHash == '2ec21195be2d5d944c92d52dc3255306e702347d6a3da6e6a2f410c6aff8dc1a': # wasd
        return True
    else:
        return False