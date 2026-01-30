import { RepositoryError } from '../errors'

export abstract class BaseRepository<T> {
  protected tableName: string
  protected records: Map<number, T> = new Map()

  constructor(tableName: string) {
    this.tableName = tableName
  }

  /**
   * Find a record by ID
   */
  findById(id: number): T | null {
    return this.records.get(id) || null
  }

  /**
   * Find all records
   */
  findAll(limit: number = 100, offset: number = 0): T[] {
    return Array.from(this.records.values()).slice(offset, offset + limit)
  }

  search(predicate: (item: T) => boolean): T[] {
    const results: T[] = []
    for (const item of this.records.values()) {
      if (predicate(item)) {
        results.push(item)
      }
    }
    return results
  }

  /**
   * Create a new record
   * use constructor of T
   */
  create(data: Partial<T>): T {
    const id = this.records.size + 1
    this.records.set(id, data as T)
    const res = this.records.get(id)
    if (res === undefined) {
      throw new RepositoryError(`Failed to create record in ${this.tableName}`)
    }
    return res
  }

  /**
   * Update a record by ID
   */
  update(id: number, data: Partial<T>): boolean {
    if (!this.records.has(id)) {
      return false
    }
    const existing = this.records.get(id)!
    this.records.set(id, { ...existing, ...data } as T)
    return true
  }

  /**
   * Delete a record by ID
   */
  delete(id: number): boolean {
    return this.records.delete(id)
  }
}
