
# This code does not work

# Generator
def stream_docs(files):
    for dir_entry in files:
        with open(dir_entry, 'r') as my_file:
            yield my_file.read()

def get_minibatch(doc_stream, size):
    docs = []
    for _ in range(size):
        text = next(doc_stream)
        docs.append(text)
    return docs

doc_stream = stream_docs(path=test_path, files=test_files)

for _ in range(n_batch_iteration):
    X_train, y_train = get_minibatch(doc_stream, size=batch_train_size)

    clf.partial_fit(X_train, y_train, classes=classes)

