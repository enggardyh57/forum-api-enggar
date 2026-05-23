class DetailedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      username,
      date,
      content,
      is_delete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete
      ? '**komentar telah dihapus**'
      : content;
  }

  _verifyPayload({
    id,
    username,
    date,
    content,
    is_delete,
  }) {
    if (
      !id
      || !username
      || !date
      || content === undefined
      || is_delete === undefined
    ) {
      throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = DetailedComment;