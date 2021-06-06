import { TextDocument } from 'vscode-languageserver-textdocument';
import { Connection, TextDocuments } from 'vscode-languageserver/node';

export class DocumentService {
	public documents: TextDocuments<TextDocument>;

	get onDidChangeContent() {
		return this.documents.onDidChangeContent;
	}

	get onDidClose() {
		return this.documents.onDidClose;
	}

	constructor(conn: Connection) {
		this.documents = new TextDocuments(TextDocument);
		this.documents.listen(conn);
	}

	getDocument(uri: string) {
		return this.documents.get(uri);
	}

	getAllDocuments() {
		return this.documents.all();
	}
}
