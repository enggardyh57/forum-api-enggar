const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;

    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO comments(id, content, owner, thread_id)
        VALUES($1, $2, $3, $4)
        RETURNING id, content, owner
      `,
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async verifyCommentExists(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('anda tidak berhak');
    }
  }

  async deleteComment(id) {
    const query = {
      text: `
        UPDATE comments
        SET is_delete = true
        WHERE id = $1
      `,
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
  const query = {
    text: `
      SELECT
        comments.id,
        users.username,
        comments.date,
        comments.content,
        comments.is_delete
      FROM comments
      JOIN users
      ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC
    `,
    values: [threadId],
  };

  const result = await this._pool.query(query);

  return result.rows;
}
}

module.exports = CommentRepositoryPostgres;